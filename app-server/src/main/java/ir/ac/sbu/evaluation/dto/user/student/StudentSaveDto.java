package ir.ac.sbu.evaluation.dto.user.student;

import ir.ac.sbu.evaluation.dto.user.PersonalInfoSaveDto;
import ir.ac.sbu.evaluation.dto.user.UserSaveDto;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentSaveDto extends UserSaveDto {

    @NotBlank
    @Pattern(regexp = "[0-9]+")
    private String studentNumber;

    private long facultyId;

    public StudentSaveDto() {
    }

    @Builder
    public StudentSaveDto(String firstName, String lastName, String username, String password,
            PersonalInfoSaveDto personalInfo,
            String studentNumber, long facultyId) {
        super(firstName, lastName, username, password, personalInfo);
        this.studentNumber = studentNumber;
        this.facultyId = facultyId;
    }

    public Student toStudent() {
        return Student.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername())
                .password(getPassword())
                .personalInfo(getPersonalInfo().toPersonalInfo())
                .studentNumber(studentNumber)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        StudentSaveDto that = (StudentSaveDto) o;
        return facultyId == that.facultyId && Objects.equals(studentNumber, that.studentNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), studentNumber, facultyId);
    }
}
